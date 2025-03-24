import { View } from "react-native";
import Text from "../text";
import { styles } from "./styles";
import { CustomTouchable } from "../custom-touchable";
import { useTheme } from "../../hooks";
import { CustomImage } from "../custom-image";
import { Images } from "../../config";
import React from "react";

type Props = {
  value: number;
  setValue: (e: number | string) => void;
  sign?: string;
};

export const IncreamentDecreamentComp: React.FC<Props> = ({
  value = 0,
  setValue,
  sign,
}) => {
  const { AppTheme } = useTheme();
  return (
    <View style={{ ...styles.container, backgroundColor: AppTheme.White }}>
      <CustomTouchable
        style={{ ...styles.btn, backgroundColor: AppTheme.skyBlue }}
        onPress={(e) => setValue(Number(value - 1))}
      >
        <CustomImage source={Images.minus} style={styles.btnIcon} />
      </CustomTouchable>
      <Text bold size={12} color={AppTheme.fontGray} centered>
        {value} {sign}
      </Text>
      <CustomTouchable
        style={{ ...styles.btn, backgroundColor: AppTheme.skyBlue }}
        onPress={(e) => setValue(Number(value + 1))}
      >
        <CustomImage source={Images.plus} style={styles.btnIcon} />
      </CustomTouchable>
    </View>
  );
};
