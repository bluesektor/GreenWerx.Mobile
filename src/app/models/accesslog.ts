import { Node } from './node';

export class AccessLog extends Node {

    AuthenticationDate: Date;

    IPAddress: string;

    UserName: string;

    /// <summary>
    /// Passed or failed the authentication scheme
    /// </summary>
    Authenticated: boolean;

    FailType: string;

    /// <summary>
    /// Where is the attempt coming from..
    /// </summary>
    Vector: string;


}
