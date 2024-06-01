var currentQuote = '';
var currentAuthor = '';
let quotesData;

var colors = ['#FA8072', '#DC143C', '#228B22', '#3CB371', '#556B2F', '#008080', '#00CED1', '#4682B4', "#6A5ACD", "#8B008B", "#C71585", "#2F4F4F", '#A52A2A'];

// check whether the current window is at the top or not and also to avoid errors!
function inIframe() { try { return window.self !== window.top; } catch (e) { return true; } }

// for custom sharing
function openURL(url) {
    window.open(url, 'Share', 'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0');
}

function getQuotes(){
    return $.ajax({
        headers: {
            Accept: 'application/json'
        },
        url: 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
        success: function(jsonQuotes){
            if(typeof jsonQuotes === 'string'){
                quotesData = JSON.parse(jsonQuotes);
            }
        }
    });    
}

function getRandomQuote() {
    let quoteNum = Math.floor(Math.random() * quotesData.quotes.length);

    return quotesData.quotes[quoteNum];
}

const getQuote = () => {
    let randomQuote = getRandomQuote();

    currentQuote = randomQuote.quote;
    currentAuthor = randomQuote.author;

    if(inIframe())
    {
        $('#tweet-quote').attr('href', 'https://twitter.com/intent/tweet?hashtags=quote,randomquote&text=' + encodeURIComponent('"' + currentQuote + '"\n - ' + currentAuthor));
    }

    $(".quote-text").animate(
        { opacity: 0 }, 300,
           function() {
                $(this).animate({ opacity: 1 }, 500);
                $('#text').text(randomQuote.quote);
            }
    );

    $(".quote-author").animate(
        { opacity: 0 }, 500,
        function () {
            $(this).animate({ opacity: 1 }, 1000);
            $('#author').text(randomQuote.author);
        }
    );

    var color = Math.floor(Math.random() * colors.length);
    $("html body").animate(
        {
            backgroundColor: colors[color],
            color: colors[color]
        },
        1000);

    $(".button").animate(
        {
            backgroundColor: colors[color]
        },1500);
}


$(document).ready(function () {
    getQuotes().then(() => {
        getQuote();
    });

    $('#new-quote').on('click', getQuote);

    $('#tweet-quote').on('click', function() {
        if(!inIframe()){
            openURL('https://twitter.com/intent/tweet?hashtags=quote,randomquote&text=' + encodeURIComponent('"' + currentQuote + '"\n - ' + currentAuthor));
        }
    });

    $('#copy-text').on('click', function() {
        navigator.clipboard.writeText(currentQuote + '\n - ' + currentAuthor);
        alert("Copied to clipboard");
    });
});