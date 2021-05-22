import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import 'App.dart';

class RedirectWeb extends App {
  RedirectWeb(Map<String, dynamic> appData): super(appData: appData);
  @override
  Function onTap(BuildContext context) {
    return () async => await launch(appData["url"]);
  }
}
