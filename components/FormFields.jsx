import { View, Text, TextInput, TouchableOpacity, Image} from 'react-native'
import React, { useState } from 'react'
import {eye,hideeye} from '../constants/icons'
const FormFields = ({title,value,placeholder,handleChangeText,otherStyles,...props}) => {
  const [ShowPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-black font-pmedium">{title}</Text>
      <View className="border-2 border-black-200 h-16 w-full px-4 bg-black-100 rounded-2xl focus:border-sky-500 flex-row items-center">
       <TextInput
       className="flex-1 font-psemibold text-black text-base"
       value={value}
       placeholder={placeholder}
       placeholderTextColor="#000000"
       onChangeText={handleChangeText}
       secureTextEntry={title === "Password" && !ShowPassword}
       />
       {
        title === "Password" && (
          <TouchableOpacity onPress={()=> setShowPassword(!ShowPassword)}>
            <Image
            source={!ShowPassword? eye:hideeye}
            className="w-6 h-6"
            resizeMode="contain"
            />
          </TouchableOpacity>
        )
       }
      </View>
    </View>
  )
}

export default FormFields