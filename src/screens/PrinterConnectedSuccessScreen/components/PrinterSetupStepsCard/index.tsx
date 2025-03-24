import { Image, ImageSourcePropType, View } from "react-native";
import { Text } from "../../../../components";
import { styles } from "./styles";
import { useTheme } from "../../../../hooks";
type printerSetupSteps = {
  isActive?: Boolean;
  icon: ImageSourcePropType;
  text?: String;
};
const PrinterSetupStepsCard = ({ isActive, icon, text }: printerSetupSteps) => {
  const { AppTheme } = useTheme();
  return (
    <View style={styles.printerSetupStepsCardContainer}>
      <View
        style={[
          styles.printerSetupStepIconView,
          isActive && { backgroundColor: AppTheme.Primary },
        ]}
      >
        <Image
          source={icon}
          style={[
            styles.printerSetupStepIcon,
            { tintColor: isActive ? AppTheme.White : AppTheme.Primary },
          ]}
        />
      </View>
      <Text semiBold size={16} color={AppTheme.fontGray} topSpacing={5}>
        {text}
      </Text>
    </View>
  );
};
export default PrinterSetupStepsCard;
