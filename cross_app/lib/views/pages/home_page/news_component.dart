import 'package:arsus/services/backend/firestore/firestore_pagination.dart';
import 'package:arsus/views/pages/home_page/new_card_component.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/widgets.dart';

class NewsComponent extends StatefulWidget {
  @override
  _NewsComponent createState() => _NewsComponent();
}

class _NewsComponent extends State<NewsComponent> {
  ScrollController _listScrollController;
  FirestorePagination firestorePagination;

  @override
  initState() {
    _listScrollController = ScrollController();
    _listScrollController.addListener(_scrollListener);
    firestorePagination = FirestorePagination();
    firestorePagination.fetchFirstList();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<List<DocumentSnapshot>>(
      stream: firestorePagination.stream,
      builder: (BuildContext context, AsyncSnapshot<List<DocumentSnapshot>> snapshot) {
        if (snapshot.hasError) {
          return Text('Something went wrong');
        }
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text("Loading...");
        }
        if (!snapshot.hasData) {
          return Text("No data");
        }
        return ListView.builder(
            controller: _listScrollController,
            itemCount: snapshot.data.length,
            itemBuilder: (context, index) => NewCardWidget(data: snapshot.data[index].data())
        );
      },
    );
  }

  _scrollListener() {
    if (_listScrollController.offset >= _listScrollController.position.maxScrollExtent-20 &&
        !_listScrollController.position.outOfRange) {
      firestorePagination.fetchNext();
    }
  }
}
