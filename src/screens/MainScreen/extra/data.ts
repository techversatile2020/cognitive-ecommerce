import { Images, NavigationService } from "../../../config";
import { EcommerceScreenNames } from "../../../config/ScreenNames";

export const opetionsData = [
  {
    icon: Images.buySupplies,
    heading: "Buy Supplies",
    subHeading: "Add Your printer add see the listing of your printer fast",
    link: "https://www.cognitivetpg.com",
    onPress: () =>
      NavigationService.navigate(EcommerceScreenNames.ProductListingScreen, {
        title: "Supplies",
      }),
  },
  {
    icon: Images.buyPrinters,
    heading: "Buy Printers",
    subHeading: "Add Your printer add see the listing of your printer fast",
    link: "https://www.cognitivetpg.com",
    onPress: () =>
      NavigationService.navigate(EcommerceScreenNames.ProductListingScreen, {
        title: "Printers",
      }),
  },
  {
    icon: Images.instructions,
    heading: "Instructions",
    subHeading: "Add Your printer add see the listing of your printer fast",
    link: "https://www.cognitivetpg.com",
  },
  {
    icon: Images.helpAndSupport,
    heading: "Help & Support",
    subHeading: "Add Your printer add see the listing of your printer fast",
    link: "https://www.cognitivetpg.com",
  },
  {
    icon: Images.addPrinterToComputer,
    heading: "Add Printer to Computer",
    subHeading: "Add Your printer add see the listing of your printer fast",
    link: "https://www.cognitivetpg.com",
  },
  {
    icon: Images.aboutCognitive,
    heading: "About Cognitive",
    subHeading: "Add Your printer add see the listing of your printer fast",
    link: "https://www.cognitivetpg.com",
  },
];
