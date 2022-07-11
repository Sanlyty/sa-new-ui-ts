import { Pipe, PipeTransform } from "@angular/core";
import { UrlCreator } from "./url-creatot.utils";

@Pipe({
  name: "iframeUrlCreator",
})
export class IframeUrlCreatorPipe implements PipeTransform {
  iFrameLinks = {
    dashboard: "1%20Dash%20Board/index.html",
    serverBoard: "2%20Server%20Board/index.html",
    dpSla: "4%20DP%20Pool%20Board%20and%20SLA/index.html",
    deepAnalysis: "7%20Deep%20Analysis/index.html",
    cache: "8%20Cache%20Board/index.html",
    adapters: "8%20CHA%20Adapters%20Board/index.html",
    trends: "8%20Trends/index.html",
    capacityAnalysis: "9%20Capacity%20Analysis/index.html",
    hostGroups: "9%20Capacity%20Analysis/VM%20Capacity%20Analysis.html",
  };
  mapSystemToDirectory = [];

  constructor() {
    this.mapSystemToDirectory["XP7_G11_58417"] = "01";
    this.mapSystemToDirectory["XP7_G12_58416"] = "02";
    this.mapSystemToDirectory["XP7_G13_58734"] = "03";
    this.mapSystemToDirectory["XP7_G14_10560"] = "04";
    this.mapSystemToDirectory["XP7_G15_20028"] = "05";
    this.mapSystemToDirectory["XP7_G16_20359"] = "06";
    this.mapSystemToDirectory["XP8_G21_30759"] = "11";
    this.mapSystemToDirectory["XP8_G22_30738"] = "12";
    this.mapSystemToDirectory["XP8_G23_30739"] = "13";
    this.mapSystemToDirectory["XP8_G24_31152"] = "14";
    this.mapSystemToDirectory["XP8_G25_31149"] = "15";
    this.mapSystemToDirectory["XP8_G26_40137"] = "16";
    // this.mapToDirectory[7] = '';
    this.mapSystemToDirectory["XP7_B12_58678"] = "22";
    this.mapSystemToDirectory["XP7_B13_59006"] = "23";
    this.mapSystemToDirectory["XP7_B14_10554"] = "24";
    this.mapSystemToDirectory["XP7_B15_10640"] = "25";
    this.mapSystemToDirectory["XP7_B16_11114"] = "26";
    this.mapSystemToDirectory["XP7_B17_50225"] = "27";
    this.mapSystemToDirectory["XP8_B22_30754"] = "32";
    this.mapSystemToDirectory["XP8_B24_31139"] = "34";
    this.mapSystemToDirectory["XP8_B25_31148"] = "35";
    this.mapSystemToDirectory["XP8_B26_40139"] = "36";

    this.mapSystemToDirectory["XP7_CBJ2_57216"] = "41";
    this.mapSystemToDirectory["XP7_CBJ3_57222"] = "42";
    this.mapSystemToDirectory["XP7_CBJ4_20575"] = "43";
    this.mapSystemToDirectory["XP7_CBJ5_56053"] = "44";
    this.mapSystemToDirectory["XP8_CBJ22_33364"] = "46";
    this.mapSystemToDirectory["XP8_CBJ23_33363"] = "47";
    this.mapSystemToDirectory["XP8_CBJ24_33898"] = "48";

    this.mapSystemToDirectory["XP7_QAS1_20610"] = "51";
    this.mapSystemToDirectory["XP7_QAS2_56139"] = "52";
    this.mapSystemToDirectory["XP8_QAS22_40268"] = "53";
    // this.mapToDirectory[13] = '';
    this.mapSystemToDirectory["XP7_STL2_10558"] = "62";
    this.mapSystemToDirectory["XP7_STL3_58634"] = "63";
    this.mapSystemToDirectory["XP8_STL21_31154"] = "64";
    this.mapSystemToDirectory["XP8_STL22_31153"] = "65";
    // this.mapSystemToDirectory[22] = '71';
    this.mapSystemToDirectory["XP7_MEG2_20725"] = "72";
    this.mapSystemToDirectory["XP8_MEG21_60132"] = "73";
    this.mapSystemToDirectory["XP8_CVGXPHUB_33988"] = "75";
    this.mapSystemToDirectory["XP8_CVGXPGTW_33984"] = "76";
    this.mapSystemToDirectory["XP7_AIMS1_20627"] = "81";
    this.mapSystemToDirectory["XP8_AIMS21_60141"] = "82";

    this.mapSystemToDirectory["XP8_LEJXPHUB_31258"] = "85";
    this.mapSystemToDirectory["XP8_LEJXPEAT_31267"] = "86";
  }

  transform(value: any, args: any): any {
    let anchorParam = "";
    if (args.anchor != null) {
      anchorParam = `#${this.normalizeAnchor(args.anchor)}`;
    }
    return UrlCreator.url(
      this.mapToDirectory(value),
      this.iFrameLinks[args.iframeLink] + anchorParam
    );
  }

  mapToDirectory(id: string) {
    if (this.mapSystemToDirectory[id] !== undefined) {
      return this.mapSystemToDirectory[id];
    }
  }

  normalizeAnchor(value) {
    if (value != null) {
      return value.replace(/[#\-\s,]+/g, "_");
    }
    return "";
  }
}
