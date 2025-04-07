import { View } from "react-native";
import CustomModal from "../custom-modal";
import { CustomImage } from "../custom-image";
import { Images } from "../../config";
import Text from "../text";
import { PrimaryButton } from "../primary-button";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";

export const ConnectionStatusModal = ({
  isVisible,
  onClose,
  icon,
  title,
  description,
  onCancel,
  onRetry,
}) => {
  const { AppTheme } = useTheme();
  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View
        style={{ ...styles.modalContainer, backgroundColor: AppTheme.White }}
      >
        <CustomImage source={icon} style={styles.deviceIcon} />
        <Text bold size={18} color={AppTheme.Black}>
          {title}
        </Text>
        <Text
          regular
          size={14}
          color={AppTheme.fontGray}
          centered
          width={270}
          topSpacing={20}
          bottomSpacing={20}
        >
          {description}
        </Text>
        <View style={styles.modalBtnsView}>
          <PrimaryButton
            title="Cancel"
            customStyles={{
              flex: 2,
              marginHorizontal: SD.wp(5),
              borderRadius: 15,
            }}
            onPress={onCancel}
          />
          <PrimaryButton
            title="Retry"
            customStyles={{ flex: 2, borderRadius: 15 }}
            onPress={onRetry}
          />
        </View>
      </View>
    </CustomModal>
  );
};
