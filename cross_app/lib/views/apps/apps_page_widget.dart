import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
class Skeleton extends StatefulWidget {
  final double height;
  final double width;

  Skeleton({Key key, this.height = 20, this.width = 200 }) : super(key: key);

  createState() => SkeletonState();
}

class SkeletonState extends State<Skeleton> with SingleTickerProviderStateMixin {
  AnimationController _controller;

  Animation gradientPosition;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: Duration(milliseconds: 1500), vsync: this);

    gradientPosition = Tween<double>(
      begin: -3,
      end: 10,
    ).animate(
      CurvedAnimation(
          parent: _controller,
          curve: Curves.linear
      ),
    )..addListener(() {
      setState(() {});
    });

    _controller.repeat();
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width:  widget.width,
      height: widget.height,
      decoration: BoxDecoration(
          gradient: LinearGradient(
              begin: Alignment(gradientPosition.value, 0),
              end: Alignment(-1, 0),
              colors: [Colors.black12, Colors.black26, Colors.black12]
          )
      ),
    );
  }
}

class AppsInformation extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    CollectionReference users =
        FirebaseFirestore.instance.collection('projects');
    return StreamBuilder<QuerySnapshot>(
      stream: users.snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return Text('Something went wrong');
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text('');
        }

        return new GridView(
          padding: EdgeInsets.symmetric(horizontal: 10),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 20,
            mainAxisSpacing: 25,
            childAspectRatio: 0.7,
          ),
          scrollDirection: Axis.vertical,
          children: snapshot.data.docs.map((DocumentSnapshot document) {
            Map<String, dynamic> data = document.data();
            return  InkWell(
              onTap: () async {
                await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AppsPageWidget(),
                  ),
                );
              },
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  SvgPicture.network(
                    data["img"],
                    semanticsLabel: data["title"],
                    width: 70,
                    height: 70,
                    fit: BoxFit.cover,
                    placeholderBuilder: (BuildContext context) => Container(
                        padding: const EdgeInsets.all(30.0),
                        child: const CircularProgressIndicator()
                    )
                  ),
                  Text(
                    data["title"],
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    softWrap: false,
                    style: FlutterFlowTheme.bodyText1.override(
                      fontFamily: 'IBM Plex Sans',
                      fontSize: 7
                    ),
                  )
                ],
              ),
            );
          }).toList(),
        );
      },
    );
  }
}

class AppsPageWidget extends StatefulWidget {
  AppsPageWidget({Key key}) : super(key: key);

  @override
  _AppsPageWidgetState createState() => _AppsPageWidgetState();
}

class _AppsPageWidgetState extends State<AppsPageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    CollectionReference projects =
        FirebaseFirestore.instance.collection('projects');
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
                elevation: 0),
          )
        ],
        centerTitle: false,
        elevation: 0,
      ),
      body: SafeArea(child: AppsInformation()),
    );
  }
}
