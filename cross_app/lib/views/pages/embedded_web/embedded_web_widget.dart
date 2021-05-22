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
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    // Enable hybrid composition.
    if (Platform.isAndroid) WebView.platform = SurfaceAndroidWebView();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Stack(
        children: <Widget>[
          WebView(
            initialUrl: widget.url,
            javascriptMode: JavascriptMode.unrestricted,
            onPageFinished: (finish) {
              setState(() {
                isLoading = false;
              });
            },
          ),
          isLoading
              ? Center(
            child: CircularProgressIndicator(),
          )
              : Stack(),
        ],
      ),
    );
  }
}
