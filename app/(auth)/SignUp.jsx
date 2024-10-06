import { Text,ScrollView, View, Image} from 'react-native'
import {Link} from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {logo} from '../../constants/image'

import FormFields from '../../components/FormFields'
import CustomButton from '../../components/CustomButton'




const SignUp = () => {

  const [Form, setForm] = useState({
    email:"",
    password:""
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const Submit = ()=>{

  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center items-center h-[83vh] px-4 my-6"
        >
          <Image
            source={logo}
            resizeMode="contain"
            className="w-[100px] h-[80px]"
          />

          <Text className="text-2xl font-semibold text-sky-500 mt-10 font-psemibold">
            Register in to TextAirDrop
          </Text>
          <FormFields
          title="UserName"
          value={Form.userName}
          handleChangeText={(e)=>{{setForm({...Form,userName:e})}}}
          otherStyles="mt-7"
          />
          <FormFields
          title="Email"
          value={Form.email}
          handleChangeText={(e)=>{{setForm({...Form,email:e})}}}
          otherStyles="mt-7"
          keyBoardType="email-address"
          />
          <FormFields
          title="Password"
          value={Form.password}
          handleChangeText={(e)=>{{setForm({...Form,password:e})}}}
          otherStyles="mt-7"
          />
          <CustomButton
          title="SingIn"
          handlePress={Submit}
          containerStyles="mt-10 w-full"
          isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg  font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/SignIn"
              className="text-lg font-psemibold text-sky-500"
            >
              SignIn
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp