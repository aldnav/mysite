
var posts = [
    {body: 'This is so cool! First post!'},
    {body: 'Not so cool but second post!'}
];

var data = [
    {owner: 'Pete Hunt', text: 'This is one comment'},
    {owner: 'Jordan Walke', text: 'This is *another* comment'}
];

var CommentBox = React.createClass({displayName: 'CommentBox',
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: JSON.parse(data.data)});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajaxSetup({
          data: {csrfmiddlewaretoken: $.cookie('csrftoken')},
        });
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                this.setState({data: JSON.parse(data.data)});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className='commentBox'>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        return (
            <li className='comment' key={this.props.pk}>
              <span className='owner'>{this.props.owner}</span>
              <span>{this.props.children}</span>
            </li>
        );
    }
});


var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment owner={comment.owner} key={comment.pk}>
                    {comment.content}
                </Comment>
            )
        });
        return (
            <ul className='commentList'>
                {commentNodes}
            </ul>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var text = this.refs.text.value.trim();
        if (!text) {
            return;
        }
        this.props.onCommentSubmit({text:text});
        this.refs.text.value = '';
        return;
    },
    render: function() {
        return (
            <form className='commentForm' onSubmit={this.handleSubmit}>
                <input type='hidden' name='csrfmiddlewaretoken' value={$.cookie('csrftoken')} />
                <input type='text' placeholder='Say something...'
                    className='commentFormInput' ref='text'/>
                <input type='submit' value='Post' style={{'display':'none'}}/>
            </form>
        );
    }
});

var PostBox = React.createClass({
    render: function() {
        return (
            <div className='postBox'>
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
            <div className='post'>
                <p>{this.props.body}</p>
                <span>{this.state.likes} likes</span>
                <CommentBox />
            </div>
        )
    }
});


// ReactDOM.render(
//   <PostBox posts={posts} />,
//   document.getElementById('content')
// );
ReactDOM.render(
  <CommentBox url='/api/comments/' pollInterval={2000} />,
  document.getElementById('content')
);
