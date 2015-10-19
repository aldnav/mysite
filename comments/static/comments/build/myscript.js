'use strict';

var posts = [{ body: 'This is so cool! First post!' }, { body: 'Not so cool but second post!' }];

var data = [{ owner: 'Pete Hunt', text: 'This is one comment' }, { owner: 'Jordan Walke', text: 'This is *another* comment' }];

var CommentBox = React.createClass({ displayName: 'CommentBox',
    loadCommentsFromServer: function loadCommentsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (function (data) {
                this.setState({ data: JSON.parse(data.data) });
            }).bind(this),
            error: (function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }).bind(this)
        });
    },
    handleCommentSubmit: function handleCommentSubmit(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({ data: newComments });
        $.ajaxSetup({
            data: { csrfmiddlewaretoken: $.cookie('csrftoken') }
        });
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: (function (data) {
                this.setState({ data: JSON.parse(data.data) });
            }).bind(this),
            error: (function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }).bind(this)
        });
    },
    getInitialState: function getInitialState() {
        return { data: [] };
    },
    componentDidMount: function componentDidMount() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'commentBox' },
            React.createElement(CommentList, { data: this.state.data }),
            React.createElement(CommentForm, { onCommentSubmit: this.handleCommentSubmit })
        );
    }
});

var Comment = React.createClass({
    displayName: 'Comment',

    render: function render() {
        return React.createElement(
            'li',
            { className: 'comment', key: this.props.pk },
            React.createElement(
                'span',
                { className: 'owner' },
                this.props.owner
            ),
            React.createElement(
                'span',
                null,
                this.props.children
            )
        );
    }
});

var CommentList = React.createClass({
    displayName: 'CommentList',

    render: function render() {
        var commentNodes = this.props.data.map(function (comment) {
            return React.createElement(
                Comment,
                { owner: comment.owner, key: comment.pk },
                comment.content
            );
        });
        return React.createElement(
            'ul',
            { className: 'commentList' },
            commentNodes
        );
    }
});

var CommentForm = React.createClass({
    displayName: 'CommentForm',

    handleSubmit: function handleSubmit(e) {
        e.preventDefault();
        var text = this.refs.text.value.trim();
        if (!text) {
            return;
        }
        this.props.onCommentSubmit({ text: text });
        this.refs.text.value = '';
        return;
    },
    render: function render() {
        return React.createElement(
            'form',
            { className: 'commentForm', onSubmit: this.handleSubmit },
            React.createElement('input', { type: 'hidden', name: 'csrfmiddlewaretoken', value: $.cookie('csrftoken') }),
            React.createElement('input', { type: 'text', placeholder: 'Say something...',
                className: 'commentFormInput', ref: 'text' }),
            React.createElement('input', { type: 'submit', value: 'Post', style: { 'display': 'none' } })
        );
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

// ReactDOM.render(
//   <PostBox posts={posts} />,
//   document.getElementById('content')
// );
ReactDOM.render(React.createElement(CommentBox, { url: '/api/comments/', pollInterval: 2000 }), document.getElementById('content'));