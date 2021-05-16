import 'package:arsus/views/apps//ine_page/ine_page_widget.dart';

import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_util.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
import '../components/web_app/web_app_widget.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'essays/essays_widget.dart';

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
        centerTitle: false,
        elevation: 0,
      ),
      body: SafeArea(
        child: GridView(
          padding: EdgeInsets.zero,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 0,
            mainAxisSpacing: 0,
            childAspectRatio: 1,
          ),
          scrollDirection: Axis.vertical,
          children: [
            InkWell(
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => InePageWidget(),
                  ),
                );
              },
              child: Image.network(
                'https://picsum.photos/seed/616/600',
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            InkWell(
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => GetUserName("9xScxbX76fIgrwY30bCr"),
                  ),
                );
              },
              child: Image.network(
                'https://picsum.photos/seed/29/600',
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            InkWell(
              onTap: () async {
                await launchURL(
                    'https://documenter.getpostman.com/view/6166162/TVemA8kt');
              },
              child: Image.network(
                'https://picsum.photos/seed/402/600',
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            Image.network(
              'https://picsum.photos/seed/404/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/200/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/127/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/680/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/286/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/823/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/615/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/218/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
            Image.network(
              'https://picsum.photos/seed/330/600',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            )
          ],
        ),
      ),
    );
  }
}
