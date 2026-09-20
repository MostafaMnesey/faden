import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { logger } from "../logger.js";
import * as db from "../../database/dbService.js";
import { FirebaseError } from "../../Types/error.js";

let fcmInitialized = false;

try {
  // Try to load Firebase credentials from environment variable first
  const envCred = process.env.FCM_SERVICE_ACCOUNT_JSON;
  let serviceAccount: Record<string, unknown> | undefined = undefined;
  if (envCred) {
    try {
      serviceAccount = JSON.parse(envCred) as Record<string, unknown>;
    } catch (e) {
      logger.error("Failed to parse FCM_SERVICE_ACCOUNT_JSON env variable:", e);
    }
  }
  // Fallback to local JSON file if environment variable is not set or invalid
  if (!serviceAccount) {
    const serviceAccountPath = path.join(process.cwd(), "rayapharma-68e7a-firebase-adminsdk-fbsvc-93e8e4b1c1.json");
    if (fs.existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")) as Record<string, unknown>;
    } else {
      logger.warn(`Firebase service account file not found at: ${serviceAccountPath}`);
    }
  }
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    fcmInitialized = true;
    logger.info("Firebase Admin initialized successfully.");
  }
} catch (error) {
  logger.error("Failed to initialize Firebase Admin:", error);
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Send push notification to a specific token
 */
export const sendPushNotification = async (
  token: string,
  { title, body, data }: PushNotificationPayload
): Promise<string | undefined> => {
  if (!fcmInitialized) {
    logger.warn("FCM not initialized. Skipping notification.");
    return;
  }
  if (!token) {
    logger.warn("No FCM token provided. Skipping notification.");
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: data ? Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ) : {},
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    logger.info(`Successfully sent FCM message to token: ${token}. Response: ${response}`);
    return response;
  } catch (error) {
    logger.error(`Error sending FCM message to token: ${token}:`, error);
    const fbError = error as FirebaseError;
    if (
      fbError.code === "messaging/invalid-registration-token" ||
      fbError.code === "messaging/registration-token-not-registered"
    ) {
      logger.info(`Cleaning up invalid/expired FCM token: ${token}`);
      await cleanupToken(token);
    }
  }
};

/**
 * Clean up invalid FCM tokens from admin model
 */
async function cleanupToken(token: string): Promise<void> {
  try {
    await db.updateMany({
      model: "admin",
      where: { fcmToken: token },
      data: { fcmToken: null },
    });
  } catch (e) {
    logger.error("Failed to cleanup FCM token from DB:", e);
  }
}

/**
 * Send push notification to multiple tokens (multicast)
 */
export const sendMulticastNotification = async (
  tokens: string[],
  { title, body, data }: PushNotificationPayload
): Promise<admin.messaging.BatchResponse | undefined> => {
  if (!fcmInitialized) {
    logger.warn("FCM not initialized. Skipping multicast notification.");
    return;
  }
  const validTokens = tokens.filter(t => typeof t === "string" && t.trim() !== "");
  if (validTokens.length === 0) {
    logger.warn("No valid FCM tokens provided for multicast. Skipping.");
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: data ? Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ) : {},
    tokens: validTokens,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    logger.info(`Successfully sent multicast FCM messages. Success: ${response.successCount}, Failure: ${response.failureCount}`);
    
    // Clean up expired tokens if any fail
    if (response.failureCount > 0) {
      const tokensToRemove: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === "messaging/invalid-registration-token" ||
            errCode === "messaging/registration-token-not-registered"
          ) {
            tokensToRemove.push(validTokens[idx]);
          }
        }
      });
      if (tokensToRemove.length > 0) {
        logger.info(`Cleaning up ${tokensToRemove.length} invalid/expired multicast FCM tokens`);
        for (const t of tokensToRemove) {
          await cleanupToken(t);
        }
      }
    }
    return response;
  } catch (error) {
    logger.error("Error sending multicast FCM messages:", error);
  }
};

export interface OrderNotificationPayload {
  id: string;
  total: number;
  currency: string;
}

/**
 * Send new order notifications to active admins
 */
export const notifyNewOrder = async (order: OrderNotificationPayload): Promise<void> => {
  try {
    // Notify all active Admins
    const admins = (await db.findMany({
      model: "admin",
      where: { fcmToken: { not: null } },
      select: { fcmToken: true },
    })) as Array<{ fcmToken: string | null }>;
    
    const adminTokens = admins.map(a => a.fcmToken).filter((t): t is string => typeof t === "string" && t !== "");
    if (adminTokens.length > 0) {
      await sendMulticastNotification(adminTokens, {
        title: "New Order Received",
        body: `Order #${order.id} has been placed. Total: ${order.total} ${order.currency.toUpperCase()}.`,
        data: { orderId: order.id, type: "new_order_admin" },
      });
    }
  } catch (err) {
    logger.error("Failed to send new order notifications to admins:", err);
  }
};
