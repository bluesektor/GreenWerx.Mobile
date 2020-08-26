export class StageData {
 UUID: string;
 Type: string;
 Domain: string;
DateParsed: Date;
 SyncDate: Date;
PublishedDate: Date;
 DataType: string;
 Result: string;
 StageResults: string;
 NSFW: string;

// the local data that may match
 LocalMatch: string;

// should be x/y  x points match over y = total number of points to test.
// name
// email
// phone
//
 MatchConfidence: string;
}
