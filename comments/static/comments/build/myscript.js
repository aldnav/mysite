'use strict';

var posts = [{ body: 'This is so cool! First post!' }, { body: 'Not so cool but second post!' }];

var CommentBox = React.createClass({ displayName: 'CommentBox',
    render: function render() {
        return React.createElement('div', { className: "commentBox" }, "Hello, world! I am a CommentBox.");
    }
});

var PostBox = React.createClass({
    displayName: 'PostBox',

    render: function render() {
        return React.createElement(
            'div',
            { className: 'postBox' },
            this.props.posts.map(function (post) {
                return React.createElement(Post, { body: post.body });
            })
        );
    }
});

var Post = React.createClass({
    displayName: 'Post',

    getInitialState: function getInitialState() {
        return { likes: 0 };
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'post' },
            React.createElement(
                'p',
                null,
                this.props.body
            ),
            React.createElement(
                'span',
                null,
                this.state.likes,
                ' likes'
            ),
            React.createElement(CommentBox, null)
        );
    }
});

ReactDOM.render(React.createElement(PostBox, { posts: posts }), document.getElementById('content'));