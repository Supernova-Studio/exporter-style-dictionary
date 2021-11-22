<img src="./readme-icon.png" alt="Supernova Logo" style="max-width:100%;">

[Supernova](https://supernova.io) is a design system platform that manages your assets, tokens, components and allows you to write spectacular documentations for your entire teams. And because you found your way here, you are probably interested in its most advanced functionality - automatic hand-off of design and development assets, tokens and data in general. To learn everything Supernova, please check out our [developer documentation](https://developers.supernova.io/).

# Style Dictionary Exporter

The Style Dictionary Exporter allows you to **convert Supernova tokens and styles into style dictionary format**, so you can use them in your pipeline, if you don't want to switch to other exporters provided by Supernova. You can generate Style Dictionary definitions either manually - on demand - using Supernova's [VS Code extension](https://marketplace.visualstudio.com/items?itemName=SupernovaIO.pulsar-vsc-extension), or automate your code delivery pipeline using Supernova [Design Continuous Delivery](https://supernova.io/automated-code-delivery).


## Example Usage

Once you have run the exporter against your design system, you can start using the code in your codebase right away. Exporter creates the following definitions:

- [x] `colors.json` containing all colors tokens
- [x] `fonts.json` containing all font tokens
- [x] `gradients.json` containing all gradient tokens
- [x] `measures.json` containing all measure tokens
- [x] `radii.json` containin all radius tokens
- [x] `shadows.json` containing all shadow tokens
- [x] `text.json` containing all semantic labels
- [x] `typography.json` containing all typography classes

Each of the `.json` files can be used inside style dictionary. The exporter properly follows the structuring of the tokens inside respective categories, adding groups as nesting inside the definition:

```
{
  "color": {
    "ui-elements": {
      "primary": {
        "value": "#4589ffff",
        "type": "color"
      },
      "success": {
        "value": "#00a454ff",
        "type": "color"
      },
      "critical": {
        "value": "#d23031ff",
        "type": "color"
      }
   }
}
```

In this case, `critical` token was defined inside `Colors` category, in `success` group. Of course, the exporter also properly exports references when you used token aliasing inside Supernova:

```

{
  "color": {
    "ui-elements": {
      "primary": {
        "value": "#4589ffff",
        "type": "color"
      },
      "primary-copy": {
        "value": "{color.ui-elements.primary.value}",
        "type": "color"
      },
   }
}
```

Finally, if you are tokens using mixins - such as using `measure` tokens inside typography, the exporter draws from those as well and **will properly export all references**, even across different definition trees. This way, everything you defined in Supernova is **always** exported.

### Comments & Descriptions

If you are using token descriptions, the exporter includes them under `comment` key:

```
{
  "text": {
    "welcome-screen": {
      "sign-in": {
        "value": "Please Sign In",
        "type": "text",
        "comment": "Use this everywhere user creates a new account"
      },
      "sign-out": {
        "value": "Sign Out from the application",
        "type": "text"
      },
      "forgot-password": {
        "value": "Did you forget your password?",
        "type": "text"
      }
    }
  }
}
```

Multi-line descriptions are also supported, and will be exported with `\n` where newline occurs. If the token doesn't have a description, the `comment` key is not generated.


## Installing

In order to make the Supernova Style Dictionary exporter available for your organization so you can start generating code from your design system, please follow the installation guide in our [developer documentation](https://developers.supernova.io/using-exporters/installing-exporters).


## Reporting Bugs or Requesting Features

In order to faciliate easy communication and speed up delivery of fixes and features for this exporter, we require everyone to log all issues and feature requests through the issue tracking of this repository. 

Please read through the [existing issues](../../issues) before you open a new issue! It might be that we have already discussed it before. If you are sure your request wasn't mentioned just yet, proceed to [open a new issue](../../issues) and fill in the required information. Thank you!


## Contributing

If you have an idea for improving this exporter package or want a specific issue fixed quickly, we would love to see you contribute to its development!  

There are multiple ways you can contribute, so we have written a [contribution guide](https://developers.supernova.io/building-exporters/contribution-and-requests) that will walk your through the process. Any pull requests to this repository are very welcome. 

Would love to help us build more but maybe need a little bit of support? [Join our community](https://community.supernova.io) and drop us a message, we will support any of your wild ideas!


## License

This exporter is distributed under the [MIT license](./LICENSE.md). [We absolutely encourage you](https://developers.supernova.io/building-exporters/cloning-exporters) to clone it and modify it for your purposes, so it fits the requirements of your stack. If you see that you have created something amazing in the process that others would benefit from, we strongly recommend you consider [publishing it back to the community](https://developers.supernova.io/building-exporters/sharing-exporters-with-others) as well.


## Useful Links

- To learn more about Supernova, [go visit our website](https://supernova.io)
- To join our community of fellow developers where we try to push what is possible with design systems and code automation, join our [community discord](https://community.supernova.io)
- To understand everything you can do with Supernova and how much time and resources it can save you, go read our [product documentation](https://learn.supernova.io/)
- Finally, to learn everything about what exporters are and how you can integrate with your codebase, go read our [developer documentation](https://developers.supernova.io/)


## Supernova Maintained Exporters

We are developing and maintaining exporters for many major technologies. Here are all the official exporters maintained by Supernova:

- [iOS Token & Style Exporter](https://github.com/Supernova-Studio/exporter-ios)
- [iOS Localization Exporter](https://github.com/Supernova-Studio/exporter-ios-localization)
- [Android Token & Style Exporter](https://github.com/Supernova-Studio/exporter-android)
- [React Token & Style Exporter](https://github.com/Supernova-Studio/exporter-react)
- [Flutter Token & Style Exporter](https://github.com/Supernova-Studio/exporter-flutter)
- [Angular Token & Style Exporter](https://github.com/Supernova-Studio/exporter-angular)
- [Typescript Token & Style Exporter](https://github.com/Supernova-Studio/exporter-typescript)
- [CSS Token & Style Exporter](https://github.com/Supernova-Studio/exporter-css)
- [LESS Token & Style Exporter](https://github.com/Supernova-Studio/exporter-less)
- [SCSS Token & Style Exporter](https://github.com/Supernova-Studio/exporter-scss)
- [Style Dictionary Exporter](https://github.com/Supernova-Studio/exporter-style-dictionary)

Additionally, you can also use asset exporters for all major targets, enjoy!:

- [SVG Asset Exporter](https://github.com/Supernova-Studio/exporter-svg-assets)
- [PDF Asset Exporter](https://github.com/Supernova-Studio/exporter-pdf-assets)
- [PNG Asset Exporter](https://github.com/Supernova-Studio/exporter-png-assets)
- [iOS Asset Catalogue Exporter](https://github.com/Supernova-Studio/exporter-ios-asset-catalogue)
- [React Native Asset Exporter](https://github.com/Supernova-Studio/exporter-react-native-assets)
- [Android Asset Exporter](https://github.com/Supernova-Studio/exporter-android-assets)
- [Flutter PNG Asset Exporter](https://github.com/Supernova-Studio/exporter-flutter-png-assets)
- [Flutter SVG Asset Exporter](https://github.com/Supernova-Studio/exporter-flutter-svg-assets)

To browse all exporters created by our amazing community, please visit the [Supernova](https://supernova.io) Exporter Store. 
