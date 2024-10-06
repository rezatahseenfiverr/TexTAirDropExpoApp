import { ScrollView, Text, View ,Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {logo} from '../constants/image'
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";


export default function Index() {
  return (
    <SafeAreaView className="  h-full ">
      <ScrollView contentContainerStyle={{height:'100%'}}>
      <View className="w-full min-h-[85vh] justify-center items-center px-4">
        <Image
        source={logo}
        className="w-[200px] h-[200px]"
        resizeMode="contain"
        />
        <Text className="text-xl">Welcome to <Text className='text-blue-500 font-bold'>TextAirDrop</Text></Text>
        <CustomButton
        title="Continue With Email"
        handlePress={()=>{ router.push("/ChatList")}}
        containerStyles="w-full mt-7"
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
