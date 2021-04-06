import {StyleSheet} from 'react-native'

export default StyleSheet.create({

      contentContainer: {
        flex: 1
      },

      ButtonSection: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    
      header: { 
        fontSize: 30
      },
    
      statusText: {
        fontSize: 30,
        marginTop: 5,
        marginBottom: 5
      },

      AlertText: {
        fontSize: 18
      },
      
      listLeft: {
        width: 160,
        flexDirection: "row",
      },

      cardAStyle: {
        marginLeft: 10, // regular "margin: x" doesnt work with native base
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
      },

      cardBStyle: {
        marginLeft: 10, // regular "margin: x" doesnt work with native base
        marginRight: 10,
        
        marginBottom: 10
      }

});