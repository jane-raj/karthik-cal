import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingRow}>
        <Text>Enable Notifications</Text>
        <Switch
          onValueChange={toggleSwitch}
          value={notificationsEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Settings; 