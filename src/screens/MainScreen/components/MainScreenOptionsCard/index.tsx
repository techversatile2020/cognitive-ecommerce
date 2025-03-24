import { CustomImage, SectionContainer, Text } from "../../../../components";
import { styles } from "./styles";

export function MainScreenOptionsCard({ icon, heading, subHeading }) {
  return (
    <SectionContainer containerStyles={styles.mainScreenOptionCard}>
      <CustomImage source={icon} style={styles.cardIcon} />
      <Text bold size={12} centered>
        {heading}
      </Text>
      <Text regular size={12} color="#4E444E" centered>
        {subHeading}
      </Text>
    </SectionContainer>
  );
}
