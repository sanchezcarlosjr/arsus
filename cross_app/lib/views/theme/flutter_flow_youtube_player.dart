import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

const kYoutubeAspectRatio = 16 / 9;

class FlutterFlowYoutubePlayer extends StatefulWidget {
  const FlutterFlowYoutubePlayer({
    @required this.url,
    this.width,
    this.height,
    this.autoPlay = false,
    this.mute = false,
    this.looping = false,
    this.showControls = true,
  });

  final String url;
  final double width;
  final double height;
  final bool autoPlay;
  final bool mute;
  final bool looping;
  final bool showControls;

  @override
  State<FlutterFlowYoutubePlayer> createState() =>
      _FlutterFlowYoutubePlayerState();
}

class _FlutterFlowYoutubePlayerState extends State<FlutterFlowYoutubePlayer> {
  YoutubePlayerController _controller;

  @override
  void initState() {
    super.initState();
    initializePlayer();
  }

  double get width => widget.width == null || widget.width >= double.infinity
      ? MediaQuery.of(context).size.width
      : widget.width;

  double get height => widget.height == null || widget.height >= double.infinity
      ? (width != null ? width / kYoutubeAspectRatio : null)
      : widget.height;

  void initializePlayer() {
    if (widget.url.isEmpty) {
      return;
    }
    final videoId = YoutubePlayer.convertUrlToId(widget.url);
    if (videoId == null) {
      return;
    }
    _controller = YoutubePlayerController(
      initialVideoId: YoutubePlayer.convertUrlToId(widget.url),
      flags: YoutubePlayerFlags(
        autoPlay: widget.autoPlay,
        mute: widget.mute,
        loop: widget.looping,
      ),
    );
  }

  @override
  Widget build(BuildContext context) => FittedBox(
        fit: BoxFit.cover,
        child: Container(
          height: height,
          width: width,
          child: _controller != null
              ? YoutubePlayer(
                  controller: _controller,
                  bottomActions: widget.showControls
                      ? [
                          const SizedBox(width: 14.0),
                          CurrentPosition(),
                          const SizedBox(width: 8.0),
                          ProgressBar(isExpanded: true),
                          RemainingDuration(),
                          const SizedBox(width: 4.0),
                          const PlaybackSpeedButton(),
                        ]
                      : [],
                )
              : Center(
                  child: Container(
                    color: Colors.black,
                    child: Text(
                      "Invalid YouTube link :(",
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ),
                ),
        ),
      );
}
