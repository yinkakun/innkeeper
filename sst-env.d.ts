/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    TestLambda: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
    TestNextJS: {
      type: "sst.aws.Nextjs"
      url: string
    }
  }
}
export {}