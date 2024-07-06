/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    Frontend: {
      type: "sst.aws.StaticSite"
      url: string
    }
    TestLambda: {
      name: string
      type: "sst.aws.Function"
      url: string
    }
  }
}
export {}