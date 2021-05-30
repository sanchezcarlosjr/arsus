import 'package:arsus/views/pages/home_page/home_page.dart';
import 'package:arsus/views/theme/util.dart';
import 'package:flutter/material.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/widgets.dart';
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
        title: InkWell(
            onTap: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => HomePageWidget(),
                ),
              );
            },
            child: Text(
              'Apps',
              style: ArsusTheme.title2,
            )
        ),
        actions: [
          FFButtonWidget(
            onPressed: () async {
              launchURL(
                  "https://www.notion.so/sanchezcarlosjr/d113793bea054a0290ad6c50ba796fab?v=a25ad083b7a745bf90099d0e60392d08");
            },
            text: 'PAPERS',
            options: FFButtonOptions(
                width: 130,
                height: 40,
                color: Color(0x00F5F5F5),
                textStyle: ArsusTheme.subtitle2.override(
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
