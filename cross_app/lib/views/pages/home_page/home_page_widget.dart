import '../../flutter_flow/flutter_flow_theme.dart';
import '../../flutter_flow/flutter_flow_widgets.dart';
import '../../flutter_flow/flutter_flow_youtube_player.dart';
import '../login_page/login_page_widget.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HomePageWidget extends StatefulWidget {
  HomePageWidget({Key key}) : super(key: key);

  @override
  _HomePageWidgetState createState() => _HomePageWidgetState();
}

class _HomePageWidgetState extends State<HomePageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Color(0x00F5F5F5),
        automaticallyImplyLeading: false,
        title: Text(
          'Arsus',
          textAlign: TextAlign.start,
          style: FlutterFlowTheme.title2.override(
            fontFamily: 'IBM Plex Sans',
          ),
        ),
        actions: [
          Align(
            alignment: Alignment(0, 0),
            child: Padding(
              padding: EdgeInsets.fromLTRB(0, 0, 1, 0),
              child: FFButtonWidget(
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => LoginPageWidget(),
                    ),
                  );
                },
                text: 'Inicia sesión',
                options: FFButtonOptions(
                  width: 130,
                  height: 40,
                  color: Colors.white,
                  textStyle: FlutterFlowTheme.subtitle2.override(
                    fontFamily: 'IBM Plex Sans',
                    color: Color(0xFFFFB24D),
                  ),
                  borderSide: BorderSide(
                    color: Color(0xFFFFB24D),
                    width: 1,
                  ),
                  borderRadius: 0,
                ),
              ),
            ),
          )
        ],
        centerTitle: false,
        elevation: 0,
      ),
      body: Padding(
        padding: EdgeInsets.fromLTRB(0, 25, 0, 0),
        child: ListView(
          padding: EdgeInsets.zero,
          scrollDirection: Axis.vertical,
          children: [
            Padding(
              padding: EdgeInsets.fromLTRB(0, 0, 0, 80),
              child: Card(
                clipBehavior: Clip.antiAliasWithSaveLayer,
                color: Color(0xFFF5F5F5),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(0),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CachedNetworkImage(
                      imageUrl:
                          'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/itb3xbu_sJ_g/v1/1000x-1.jpg',
                      width: double.infinity,
                      height: 200,
                      fit: BoxFit.cover,
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Expanded(
                          child: AutoSizeText(
                            'The Supreme Court has some introspection to do',
                            textAlign: TextAlign.start,
                            style: FlutterFlowTheme.title2.override(
                              fontFamily: 'IBM Plex Sans',
                            ),
                          ),
                        )
                      ],
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Expanded(
                              child: AutoSizeText(
                                'Bloomberg Opinion hace 5 dias',
                                textAlign: TextAlign.start,
                                style: FlutterFlowTheme.subtitle2.override(
                                  fontFamily: 'IBM Plex Sans',
                                ),
                              ),
                            )
                          ],
                        )
                      ],
                    )
                  ],
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(0, 0, 0, 80),
              child: Card(
                clipBehavior: Clip.antiAliasWithSaveLayer,
                color: Color(0x00EEEEEE),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(0),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    FlutterFlowYoutubePlayer(
                      url: 'https://www.youtube.com/watch?v=kJIBAp48Pv8',
                      autoPlay: false,
                      looping: true,
                      mute: false,
                      showControls: true,
                    )
                  ],
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.fromLTRB(0, 0, 0, 80),
              child: Card(
                clipBehavior: Clip.antiAliasWithSaveLayer,
                color: Color(0x00EEEEEE),
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(0),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Expanded(
                          child: AutoSizeText(
                            'Facebook developing AI to understand videos / Megvii files for IPO in Shanghai / Hack of facial recognition cameras ',
                            textAlign: TextAlign.start,
                            style: FlutterFlowTheme.title2.override(
                              fontFamily: 'IBM Plex Sans',
                            ),
                          ),
                        )
                      ],
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Expanded(
                              child: AutoSizeText(
                                'Inside AI hace 10 dias',
                                textAlign: TextAlign.start,
                                style: FlutterFlowTheme.subtitle2.override(
                                  fontFamily: 'IBM Plex Sans',
                                ),
                              ),
                            )
                          ],
                        )
                      ],
                    )
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
