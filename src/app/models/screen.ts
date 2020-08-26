// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

export class Screen {

    Caption: string;

    Command: string;

    Field: string;

    Value: string;

    Type: string;

    Operator: string;

    Junction: string;

    Order: number;

    Selected: boolean;

      /// <summary>
        /// this will let us know how to process the filter
        /// types:  "sql" for reqular sql expressions
        ///         "linq" for processing by linq, you'll have create the logic, no builder yet.
        ///
        /// </summary>
        //
        ParserType: string;
}
