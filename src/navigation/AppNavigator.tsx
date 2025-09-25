import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import UserTabs from './UserTabs';
import AdminTabs from './AdminTabs';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppNavigator = () => {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        user.role === 'admin' ? <AdminTabs /> : <UserTabs />
      ) : (
        <AuthStack />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;