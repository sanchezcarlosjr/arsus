import 'package:flutter/material.dart';
import 'package:arsus/views/theme/flutter_flow_theme.dart';
import 'package:arsus/views/theme/flutter_flow_widgets.dart';
import 'grid_apps_component.dart';

class AppsPageWidget extends StatefulWidget {
  AppsPageWidget({Key key}) : super(key: key);

  @override
  _AppsPageWidgetState createState() => _AppsPageWidgetState();
}

class _AppsPageWidgetState extends State<AppsPageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Color(0x00F5F5F5),
        centerTitle: false,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Text(
          'Apps',
          style: FlutterFlowTheme.title2.override(
            fontFamily: 'IBM Plex Sans',
          ),
        ),
        actions: [
          FFButtonWidget(
            onPressed: () {
              print('Button pressed ...');
            },
            text: 'PAPERS',
            options: FFButtonOptions(
                width: 130,
                height: 40,
                color: Colors.white,
                textStyle: FlutterFlowTheme.subtitle2.override(
                  fontFamily: 'IBM Plex Sans',
                  color: Color(0xBB000000),
                ),
                borderSide: BorderSide(
                  color: Colors.transparent,
                  width: 1,
                ),
                borderRadius: 0,
                elevation: 0
            ),
          )
        ],
      ),
      body: SafeArea(child: GridApps()),
    );
  }
}
