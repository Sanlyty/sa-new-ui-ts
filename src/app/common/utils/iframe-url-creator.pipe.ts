import { Pipe, PipeTransform } from "@angular/core";
import { UrlCreator } from "./url-creatot.utils";

const iFrameLinks = {
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
const mapSystemToDirectory = {
  XP7_G11_58417: "01",
  XP7_G12_58416: "02",
  XP7_G13_58734: "03",
  XP7_G14_10560: "04",
  XP7_G15_20028: "05",
  XP7_G16_20359: "06",

  XP8_G21_30759: "11",
  XP8_G22_30738: "12",
  XP8_G23_30739: "13",
  XP8_G24_31152: "14",
  XP8_G25_31149: "15",
  XP8_G26_40137: "16",

  XP7_B12_58678: "22",
  XP7_B13_59006: "23",
  XP7_B14_10554: "24",
  XP7_B15_10640: "25",
  XP7_B16_11114: "26",
  XP7_B17_50225: "27",

  XP8_B22_30754: "32",
  XP8_B24_31139: "34",
  XP8_B25_31148: "35",
  XP8_B26_40139: "36",

  XP7_CBJ2_57216: "41",
  XP7_CBJ3_57222: "42",
  XP7_CBJ4_20575: "43",
  XP7_CBJ5_56053: "44",
  XP8_CBJ22_33364: "46",
  XP8_CBJ23_33363: "47",
  XP8_CBJ24_33898: "48",
  XP8_CBJ25_60061: "49",

  XP7_QAS1_20610: "51",
  XP7_QAS2_56139: "52",
  XP8_QAS22_40268: "53",
  XP8_QAS21_60133: "54",

  XP7_STL2_10558: "62",
  XP7_STL3_58634: "63",
  XP8_STL21_31154: "64",
  XP8_STL22_31153: "65",

  XP7_MEG2_20725: "72",
  XP8_MEG21_60132: "73",
  XP8_CVGXPHUB_33988: "75",
  XP8_CVGXPGTW_33984: "76",

  XP7_AIMS1_20627: "81",
  XP8_AIMS21_60141: "82",

  XP8_LEJXPHUB_31258: "85",
  XP8_LEJXPEAT_31267: "86",
};

const normalizeAnchor = (value: string | null | undefined) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[#\-\s,]+/g, "_");
};

@Pipe({
  name: "iframeUrlCreator",
})
export class IframeUrlCreatorPipe implements PipeTransform {
  transform(value: any, args: any) {
    const anchorParam = !args.anchor ? "" : `#${normalizeAnchor(args.anchor)}`;

    return UrlCreator.url(
      mapSystemToDirectory[value],
      iFrameLinks[args.iframeLink] + anchorParam
    );
  }
}
