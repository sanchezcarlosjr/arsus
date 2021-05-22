import 'dart:io';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class EmbeddedWebPage extends StatefulWidget {
  final String url;

  EmbeddedWebPage({@required this.url});

  @override
  _EmbeddedWebPageState createState() => _EmbeddedWebPageState();
}

class _EmbeddedWebPageState extends State<EmbeddedWebPage> {
  @override
  void initState() {
    super.initState();
    // Enable hybrid composition.
    if (Platform.isAndroid) WebView.platform = SurfaceAndroidWebView();
  }

  @override
  Widget build(BuildContext context) {
    return WebView(
        initialUrl: widget.url,
        javascriptMode: JavascriptMode.unrestricted
    );
  }
}
