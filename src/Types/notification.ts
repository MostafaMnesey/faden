export interface AddNotificationJobArgs {
  scheduleId: string;
  studentId: string;
  type: string;
  sendAt: string | number | Date;
}

export interface NotificationJobData {
  scheduleId: string;
  studentId: string;
  type: string;
}
