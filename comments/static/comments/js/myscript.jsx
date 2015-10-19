
var posts = [
    {body: 'This is so cool! First post!'},
    {body: 'Not so cool but second post!'}
];

var CommentBox = React.createClass({displayName: 'CommentBox',
  render: function() {
    return (
      React.createElement('div', {className: "commentBox"},
        "Hello, world! I am a CommentBox."
      )
    );
  }
});

var PostBox = React.createClass({
    render: function() {
        return (
            <div className="postBox">
                {this.props.posts.map(function (post) {
                    return (
                        <Post body={post.body} />
                    )
                })}
            </div>
        );
    }
});

var Post = React.createClass({
    getInitialState: function() {
        return {likes: 0}
    },
    render: function() {
        return (
            <div className="post">
                <p>{this.props.body}</p>
                <span>{this.state.likes} likes</span>
                <CommentBox />
            </div>
        )
    }
});

ReactDOM.render(
  <PostBox posts={posts} />,
  document.getElementById('content')
);
