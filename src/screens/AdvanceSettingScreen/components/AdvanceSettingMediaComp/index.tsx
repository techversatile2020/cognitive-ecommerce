import { useEffect, useState } from "react";
import {
  IncreamentDecreamentComp,
  InfoFieldComp,
  Loader,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../../../components";
import { styles } from "./styles";
import { View } from "react-native";
import { sendRequest } from "../../../../services/printerServices";
import { toast } from "../../../../utils/toast.utils";
import { usePrinter } from "../../../../hooks";
import { generateTestLabelScript } from "../../../../utils/printer.utls";
export const AdvanceSettingMediaComp = ({ data }) => {
  const { TOFAdj, IP_Address, LanguageV } = data;
  const [formAdjust, setFormAdjust] = useState<any>(0);
  const [loading, setLoading] = useState(null);
  const { refetch } = usePrinter(IP_Address);
  useEffect(() => {
    setFormAdjust(Number(TOFAdj));
  }, [TOFAdj]);

  const handleSetValues = async () => {
    try {
      setLoading(`Updating settings...`);
      let response = await sendRequest({
        ip: IP_Address,
        endpoint: "saveprintervarvalues.cgi",
        method: "POST",
        data: `TOFAdj=${Number(formAdjust)}`,
      });
      refetch();
      console.log("values setter response => ", response);
      setLoading(null);
      toast.success("Success setting updated!");
    } catch (err) {
      setLoading(null);
      console.log("Setting value error => ", err);
      toast.fail("Failed", "Update failed.");
    }
  };

  const handleTestPrint = async () => {
    try {
      setLoading("Sending test command...");

      let script = generateTestLabelScript(LanguageV, {
        topOfForm: formAdjust,
      });

      let response = await sendRequest({
        ip: IP_Address,
        endpoint: "scripttransfer.cgi",
        method: "POST",
        data: script,
        headers: { "Content-Type": "text/plain" },
      });
      console.log("values afer test => ", response);
      setLoading(null);
      toast.success("Test print command sent!");
    } catch (error) {
      setLoading(null);
      console.log("Setting value error => ", error);

      toast.fail("Failed", "Test failed.");
    }
  };
  return (
    <MainContainer
      customeStyle={{
        // marginTop: SD.hp(20),
        paddingHorizontal: 0,
        paddingVertical: 0,
        padding: 0,
      }}
    >
      <View style={{ flex: 1 }}>
        <InfoFieldComp
          title="Top Of Form Adjust"
          children={
            <IncreamentDecreamentComp
              value={formAdjust}
              setValue={(e) => setFormAdjust(e)}
              sign="in"
            />
          }
        />
      </View>
      <PrimaryButton
        title="Apply"
        customStyles={{ borderRadius: 15 }}
        onPress={handleSetValues}
      />
      <PrimaryButton
        title="Test Print"
        customStyles={{ borderRadius: 15, marginVertical: 0 }}
        onPress={handleTestPrint}
      />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};
