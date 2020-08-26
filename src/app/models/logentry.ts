/*
[InnerException]
      ,[Level]
      ,[LogDate]
      ,[Source]
      ,[StackTrace]
      ,[Type]
      ,[User]
      ,[NSFW]
      ,[UUID]
  FROM [GreenWerx].[dbo].[SystemLog]
    [Table("SystemLog")]

*/

export class LogEntry {

    UUID: string;

    InnerException: string;

    Level: string;

    LogDate: Date;

    Source: string;

    StackTrace: string;

    Type: string;

    User: string;
}
