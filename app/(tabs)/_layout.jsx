import { View, Text ,Image } from 'react-native'
import {Tabs,Redirect} from 'expo-router'
import {profile,friends,chats} from '../../constants/icons'
import React from 'react'

const TabsLayout = () => {
    const TabIcon = ({icon , color , name , focused})=>{
        
        return(
            <View className="items-center justify-center gap-2">
                <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-6 h-6"
                />
                <Text className={`${focused ?  'font-psemibold':'font-pregular'} text-xs`} style={{color: color}}>{name}</Text>
            </View>
        )
    }
  return (
    <>
    <Tabs screenOptions={
        {
            tabBarShowLabel:false,
            tabBarActiveTintColor:"#FFA001",
            tabBarInactiveTintColor:"#CDCDE0",
            tabBarStyle:{
                backgroundColor:"#00c2e0",
                borderTopWidth:1,
                borderTopColor:"#00c2e0",
                
                paddingTop:30,
                height:84,
            }

        }
    }>
        <Tabs.Screen name="ChatList" options={{
            title:"Chats",
            headerShown:false,
            tabBarIcon: ({color,focused})=>{
              return(<TabIcon
                 icon={chats}
                 color={color}
                 name="Chats"
                 focused={focused}
                />)
            }
        }}/>
        <Tabs.Screen name="FrindList" options={{
            title:"Friends",
            headerShown:false,
            tabBarIcon: ({color,focused})=>{
              return(<TabIcon
                 icon={friends}
                 color={color}
                 name="Friends"
                 focused={focused}
                />)
            }
        }}/>
        <Tabs.Screen name="Profile" options={{
            title:"Profile",
            headerShown:false,
            tabBarIcon: ({color,focused})=>{
              return(<TabIcon
                 icon={profile}
                 color={color}
                 name="Profile"
                 focused={focused}
                />)
            }
        }}/>
    </Tabs>
    </>
  )
}

export default TabsLayout;