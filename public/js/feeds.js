
var Feed = React.createClass({

  render: function() {
    var feedClasses = classNames('feed', 'underline');
    var classes = classNames('feedAuthor', 'blue');
    return (
      <div className={feedClasses}>
        <b className={classes}>
          {this.props.author}
        </b>&nbsp;
        <span className="orange">({moment(this.props.feed_date).format('DD-MMM-YYYY HH:mm')})&nbsp;</span>
        <span>{this.props.text}</span>
      </div>
    );
  }
});

var FeedBox = React.createClass({
  loadFeedsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleFeedSubmit: function(feed) {
    var feeds = this.state.data;
    var newFeeds = feeds.concat([feed]);
    this.setState({data: newFeeds});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: feed,
      success: function(data) {
        this.setState({data: newFeeds});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: newFeeds});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadFeedsFromServer();
    setInterval(this.loadFeedsFromServer, this.props.pollInterval);
  },
  render: function() {
    var commentClasses = classNames('upperline');
    var backgroundClasses = classNames('col-md-2', 'light-blue-back');
    return (
    <div className="feedBox">
      <div className={backgroundClasses}></div>
      <div className="col-md-8">
        <h1 className="text-center">Twitter Feeds</h1>
        <FeedForm onFeedSubmit={this.handleFeedSubmit} />
        <h3 className={commentClasses}>Comments</h3>
        <FeedList data={this.state.data} />
      </div>
      <div className={backgroundClasses}></div>
    </div>
    );
  }
});

var FeedList = React.createClass({
  render: function() {
    var feedNodes = this.props.data.map(function(feed) {
      return (
        <Feed author={feed.author} key={feed._id} text={feed.text} feed_date={feed.feed_date}>
        </Feed>
      );
    });
    return (
      <div className="feedList">
        {feedNodes}
      </div>
    );
  }
});

var FeedForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text) {
      return;
    }
    this.props.onFeedSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    var formClasses = classNames('feedForm', 'row', 'lighter-font');
    var classes = classNames('btn-primary', 'pull-right', 'lighter-font');
    return (
      <form className={formClasses} onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} />
        <textarea rows='3' cols='120' placeholder="Write your comment..." onChange={this.handleTextChange} value={this.state.text} />
        <div className="col-md-12">
          <div className="col-md-11"></div>
          <div className="col-md-1">
            <input type="submit" className={classes} value=" Post " />
          </div>
        </div>
      </form>
    );
  }
});

ReactDOM.render(
  <FeedBox url="/twitter-feeds" pollInterval={15000} />,
  document.getElementById('content')
);
