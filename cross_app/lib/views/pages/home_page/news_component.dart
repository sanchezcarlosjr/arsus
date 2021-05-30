import 'package:arsus/views/pages/home_page/new_card_component.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/widgets.dart';

class NewsComponent extends StatefulWidget {
  @override
  _NewsComponent createState() => _NewsComponent();
}

class _NewsComponent extends State<NewsComponent> {
  ScrollController _listScrollController;

  @override
  void initState() {
    _listScrollController = ScrollController();
    _listScrollController.addListener(_scrollListener);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<QuerySnapshot>(
      stream: FirebaseFirestore.instance.collection('content').orderBy("created_at").limitToLast(5).snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return Text('Something went wrong');
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text("Loading...");
        }
        return ListView.builder(
          controller: _listScrollController,
          itemCount: snapshot.data.docs.length,
          itemBuilder: (context, index) => NewCardWidget(data: snapshot.data.docs[index].data())
        );
      },
    );
  }

  _scrollListener() {
    if (_listScrollController.offset >= _listScrollController.position.maxScrollExtent &&
        !_listScrollController.position.outOfRange) {
      print("Bottom");
    }
  }
}
