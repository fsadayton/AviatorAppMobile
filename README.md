# AVIATOR Features

A Victim Information App To Ohio Resources (AVIATOR) provides a single access point to community resources that allows victims to easily search for and contact local service providers based on their needs. Specifically, AVIATOR offers assistance in finding:
#### Personal Resources
Whether someone is a victim of a crime or a victim of circumstances, AVIATOR provides quick access to a multitude of different resources. Have you lost your house due to unemployment or a natural disaster? Are you feeling ill, but cannot afford a doctor’s visit? Or do you need help removing yourself or a loved one from a harmful domestic situation? AVIATOR can help find the services that best address your needs.
#### Law & Corrections Services
Navigating the criminal justice system is often stressful and confusing. AVIATOR lessens the learning curve by putting victims in direct contact with those who are most familiar with the justice system. In addition, AVIATOR can help users find and be alerted to any changes in the incarceration status of specific perpetrators.
#### Victim Compensation
Being a victim of a violent crime is not only emotionally devastating, but it can also put undue financial strain on families. AVIATOR will connect users to local and state-wide resources that can help victims receive financial assistance to cover expenses that are often associated with violent crimes, such as health- and funeral-related costs.
#### Specialized Services
Similar to the “Personal Resources” feature, AVIATOR can help users find specialized resources for veterans, the elderly, the deaf community, and more.
#### Crisis Contacts
In times of extreme mental or emotional despair, AVIATOR provides quick access to a list of local service providers that offer 24-hour manned phone lines for a multitude of different crises, ranging from suicide prevention to domestic violence help. Regardless of the situation, a real person will always be ready to assist AVIATOR users in their time of need.
#### Other features
In the event that you need immediate help from a trusted friend or family member, AVIATOR allows users to instantly send a custom message to 5 trusted family members or friends without leaving the app. In addition, the app can quickly be hidden and replaced with a favorite website with a single touch of AVIATOR’s quick-hide button.
# How to Repurpose AVIATOR
In order to modify AVIATOR for your own community, you will need several technical components. In addition, you will need to modify several files.
#### Technical Requirements
AVIATOR was built using the Appcelerator cross-development platform, which allows developers to target multiple mobile platforms under a single codebase. Therefore, using Appcelerator is crucial to reusing the provided code. To begin, use Appcelerator's [Quick Start guide](http://docs.appcelerator.com/platform/latest/#!/guide/Quick_Start) to setup your development environment. In addition to Appcelerator, the following sections highlight the requirements for both Android and iOS platforms. 
##### Android Development
For Android development, you will need:
 - Android SDK
   - This should be installed as part of Appcelerator's [Quick Start guide](http://docs.appcelerator.com/platform/latest/#!/guide/Quick_Start)
 - Genymotion Emulator
   - Although not technically required, the Genymotion Android emulators are much faster than the stock Android emulators that come with the Android SDK. Instructions on using Genymotion with Appcelerator can be found [here](http://docs.appcelerator.com/platform/latest/#!/guide/Installing_Genymotion).   
 - Google Account
   - Used for deploying an app to the Google Play Store. It should be noted that in order to keep an app in the Google Play Store, you will need to pay $25/year. Details regarding the Google Play deployment process can be found [here](http://docs.appcelerator.com/platform/latest/#!/guide/Distributing_Android_apps).
##### iOS Development
For iOS Development, you will need:
 - Macintosh Computer
   - Unfortunately, iOS apps cannot be built using anything other than a Mac computer.  
 - Xcode/iOS SDK
   - This should be installed as part of Appcelerator's [Quick Start guide](http://docs.appcelerator.com/platform/latest/#!/guide/Quick_Start)   
 - iOS Device
   - Not all features are available via the iOS Simulator. In order to test these features, the app will need to be [loaded onto a real device](http://docs.appcelerator.com/platform/latest/#!/guide/Deploying_to_iOS_devices). 
 - Apple Developer Certificate
   - Used for deploying an app to the App Store. It should be noted that in order to keep an app in the App Store, you will beed to pay $99/year. Details regarding the App Store deployment process can be found [here](http://docs.appcelerator.com/platform/latest/#!/guide/Distributing_iOS_apps).
##### Other
Once your development environment is setup, the following code changes will need to take place:
 - Update any TODO's in the app folder of the codebase
   - This includes changing the logo and replacing the user agreement with own verbiage
 - Change the color scheme (find and replace). The primary colors used in the app are:
   - #203444 - navy blue
   - #009577 - green
   - #006e58 - dark green
   - #e9931a - yellow
 - Change the REST URLs in config.json
 - Modify the tiapp.xml with own production/development keys

# License
```c++
The MIT License (MIT)

Copyright (c) 2016 Family Services of Dayton - UDRI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```