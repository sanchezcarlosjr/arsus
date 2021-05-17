import 'package:arsus/views/theme/theme.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class GridApps extends StatelessWidget {
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
                 print("A");
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
