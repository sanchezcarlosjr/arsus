import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/material.dart';

import 'App.dart';

class EmbeddedWeb extends App {
  EmbeddedWeb(Map<String, dynamic> appData) : super(appData: appData);

  @override
  Function onTap(BuildContext context) {
    return () async => await launch(appData["url"]);
  }
}
