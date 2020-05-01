import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
type User = FirebaseAuthTypes.User;

export interface Props {
  children: React.ReactNode;
}

const Authentication = ({children}: Props) => {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState<User>();
  const [registerEmail, setRegisterEmail] = React.useState('');
  const [registerPassword, setRegisterPassword] = React.useState('');
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [activeLogin, setActiveLogin] = React.useState(true);
  const onAuthStateChanged = (user: User | null) => {
    setUser(user as User);
    if (initializing) setInitializing(false);
  };
  const toggleLogin = () => {
    setActiveLogin(!activeLogin);
  };
  const register = async () => {
    try {
      await auth().createUserWithEmailAndPassword(
        registerEmail,
        registerPassword,
      );
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (e.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(e);
    }
  };
  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(loginEmail, loginPassword);
    } catch (e) {
      console.error(e);
    }
  };
  const renderRegister = () => {
    return (
      <View>
        <Text>Register</Text>
        <View>
          <TextInput
            testID={'register-email'}
            placeholder={'Email'}
            value={registerEmail}
            onChangeText={setRegisterEmail}
          />
        </View>
        <View>
          <TextInput
            testID={'register-password'}
            placeholder={'Password'}
            secureTextEntry={true}
            value={registerPassword}
            onChangeText={setRegisterPassword}
          />
        </View>
        <View>
          <Button
            testID={'register-submit'}
            title={'Login'}
            onPress={register}
          />
        </View>
        <Text testID="toggle-login" onPress={toggleLogin}>
          Have a account? Login!
        </Text>
      </View>
    );
  };

  const renderLogin = () => {
    return (
      <View>
        <Text>Login</Text>
        <View>
          <TextInput
            testID={'login-email'}
            placeholder={'Email'}
            value={loginEmail}
            onChangeText={setLoginEmail}
          />
        </View>
        <View>
          <TextInput
            testID={'login-password'}
            placeholder={'Password'}
            secureTextEntry={true}
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
        </View>
        <View>
          <Button testID={'login-submit'} title={'Login'} onPress={login} />
        </View>
        <Text testID="toggle-register" onPress={toggleLogin}>
          Don't have account? Register!
        </Text>
      </View>
    );
  };

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing)
    return (
      <View>
        <Text>Initializing ...</Text>
      </View>
    );

  if (!user) {
    return <View>{activeLogin ? renderLogin() : renderRegister()}</View>;
  }

  return <>{children}</>;
};

export default Authentication;
