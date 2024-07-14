/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    EmailSender: {
      sender: string
      type: "sst.aws.Email"
    }
    InngestLambda: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    ProcessJournalEntryLambda: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
  }
}
export {}