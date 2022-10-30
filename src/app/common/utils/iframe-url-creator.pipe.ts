import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "iframeUrlCreator",
})
export class IframeUrlCreatorPipe implements PipeTransform {
  transform(value: any, args: any) {
    return `/overview/${value}/${args.iframeLink}`;
  }
}
