// UI classes are specifically for displaying data that is not
// formatted when returned from the API.
import { Profile } from '../profile';

export class ProfileUI extends Profile {
    AgeGender: string;
    ImageThumb: string;
    LocationCaption: string;
    VerificationCaption: string;
}
