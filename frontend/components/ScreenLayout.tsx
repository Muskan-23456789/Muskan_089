import React from 'react';
import { SafeAreaView, View, Platform, StatusBar } from 'react-native';

interface ScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, className }) => {
  return (
    <SafeAreaView className={`flex-1 bg-gray-50 ${className}`} style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <View className="flex-1 px-4">
        {children}
      </View>
    </SafeAreaView>
  );
};
