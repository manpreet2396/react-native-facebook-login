// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, {Fragment} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   ScrollView,
//   View,
//   Text,
//   StatusBar,
// } from 'react-native';

// import {
//   Header,
//   LearnMoreLinks,
//   Colors,
//   DebugInstructions,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// const App = () => {
//   return (
//     <Fragment>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <Header />
//           {global.HermesInternal == null ? null : (
//             <View style={styles.engine}>
//               <Text style={styles.footer}>Engine: Hermes</Text>
//             </View>
//           )}
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Step One</Text>
//               <Text style={styles.sectionDescription}>
//                 Edit <Text style={styles.highlight}>App.js</Text> to change this
//                 screen and then come back to see your edits.
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>See Your Changes</Text>
//               <Text style={styles.sectionDescription}>
//                 <ReloadInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Debug</Text>
//               <Text style={styles.sectionDescription}>
//                 <DebugInstructions />
//               </Text>
//             </View>
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Learn More</Text>
//               <Text style={styles.sectionDescription}>
//                 Read the docs to discover what to do next:
//               </Text>
//             </View>
//             <LearnMoreLinks />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </Fragment>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     backgroundColor: Colors.lighter,
//   },
//   engine: {
//     position: 'absolute',
//     right: 0,
//   },
//   body: {
//     backgroundColor: Colors.white,
//   },
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: Colors.black,
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//     color: Colors.dark,
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   footer: {
//     color: Colors.dark,
//     fontSize: 12,
//     fontWeight: '600',
//     padding: 4,
//     paddingRight: 12,
//     textAlign: 'right',
//   },
// });

// export default App;
/////////////////////////////////////////////////////////////////////////
import React, { Component } from 'react';

import { View, StyleSheet, Text, Alert, Image,
TouchableOpacity } from 'react-native';

import { LoginButton, AccessToken, GraphRequest, GraphRequestManager,LoginManager } from 'react-native-fbsdk';

export default class App extends Component {

  constructor() {
    super();
    this.state = {

      user_name: '',
      avatar_url: '',
      birthday_:'',
      friends_:'',
      email:'',
      avatar_show: false
    }
  }

  get_Response_Info = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {

      this.setState({ user_name: 'Welcome' + ' ' + result.name });
      this.setState({ birthday_: 'Birthday' + ' ' + result.birthday });
      this.setState({ friends_: 'Friends' + ' ' + result.friends });
      this.setState({ email: 'Email' + ' ' + result.email });

      this.setState({ avatar_url: result.picture.data.url });

      this.setState({ avatar_show: true })

      // console.log('name',name);
      // console.log('bd',birthday);
      // console.log('fr',friends);

      console.log(result);

    }
  }

  onLogout = () => {

    this.setState({ user_name: null, avatar_url: null,birthday_:null,friends_:null, avatar_show: false });

  }
  login()
  {
    LoginManager.logInWithPermissions(['public_profile','email','user_birthday'])
    .then((result)=>
    {
      console.log("re",result)
      AccessToken.getCurrentAccessToken().then(data => {
        console.log(data.accessToken.toString());

        const processRequest = new GraphRequest(
          '/me?fields=name,picture.type(large),birthday,friends,email',
          null,
          this.get_Response_Info
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(processRequest).start();
    })
  })
  .catch(error =>
    {
      console.log(error)
    })
  }
  render() {
    return (
      <View style={styles.container}>


        {this.state.avatar_url ?
          <Image
            source={{ uri: this.state.avatar_url }}
            style={styles.imageStyle} /> : null}

        <Text style={styles.text}> {this.state.user_name} </Text>
        <Text style={styles.text}> {this.state.birthday_} </Text>
        <Text style={styles.text}> {this.state.friends_} </Text>
        <Text style={styles.text}> {this.state.email} </Text>


<TouchableOpacity style={{flex:0.2,backgroundColor:'blue'}} onPress={()=>this.login()}>
<Text >
  result
</Text>
</TouchableOpacity>

        <LoginButton
          readPermissions={['public_profile','email']}
          onLoginFinished={(error, result) => {
            if (error) {
              console.log(error.message);
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                console.log(data.accessToken.toString());

              

                const processRequest = new GraphRequest(
                  '/me?fields=name,picture.type(large),birthday,friends,email',
                  null,
                  this.get_Response_Info
                );
                // Start the graph request.
                new GraphRequestManager().addRequest(processRequest).start();

              });
            }
          }}
          onLogoutFinished={this.onLogout}
        />

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  text: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    padding: 20
  },

  imageStyle: {

    width: 200,
    height: 300,
    borderRadius:100,
    resizeMode: 'contain'

  }
});