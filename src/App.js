import React from "react";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      currentPage: 0,
      totalPages: 0,
      results: []
    };
    this.handleText = this.handleText.bind(this);
    this.getResult = this.getResult.bind(this);
    this.fetchResult = this.fetchResult.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }
  handleText(e) {
    this.setState({ searchText: e.target.value });
  }
  getResult(e, searchTxt) {
    const searchTerm = searchTxt || this.state.searchText;
    if (searchTxt) {
      this.setState({ searchText: searchTxt });
    }
    this.fetchResult(searchTerm, 1);
  }
  fetchResult(searchTxt, pageNo) {
    const searchUrl = `https://content.guardianapis.com/search?api-key=test&q=${searchTxt}&showfields=thumbnail,headline&show-tags=keyword&page=${pageNo}&page-size=10`;
    fetch(searchUrl)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        const results = response.response.results;
        const totalPages = response.response.pages;
        const currentPage = response.response.currentPage;
        this.setState({
          results,
          totalPages,
          currentPage
        });
      });
  }
  prev() {
    const searchTerm = this.state.searchText;
    const pageNo = this.state.currentPage - 1;
    this.fetchResult(searchTerm, pageNo);
  }
  next() {
    const searchTerm = this.state.searchText;
    const pageNo = this.state.currentPage + 1;
    this.fetchResult(searchTerm, pageNo);
  }

  render() {
    const { searchText, results, currentPage, totalPages } = this.state;
    return (
      <div className="App">
        <div>
          {" "}
          <h1>News Lister</h1>
        </div>
        <div className="search-contianer">
          <label htmlFor="searchText">Enter Search Text</label>
          <input
            id="searchText"
            value={searchText}
            onChange={this.handleText}
          />
          <button className="search-bt" onClick={this.getResult}>
            {" "}
            Search{" "}
          </button>
        </div>
        {results.length > 0 && (
          <div className="result-container">
            <p>Result for {searchText}</p>
            <div className="result-list">
              {results.map((elem, index) => {
                return (
                  <div key={index} className="result">
                    <div className="img-container">
                      <img
                        src="https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png"
                        alt=""
                      />
                    </div>
                    <div className="text-container">
                      <a href={elem.webUrl} target="_blank">
                        {elem.webTitle}
                      </a>
                      <p className="keyword-wrapper">
                        {elem.tags.map((keyElem, keyIndex) => {
                          return (
                            <span
                              key={keyIndex}
                              className="keyword-placeholder"
                              onClick={e => this.getResult(e, keyElem.webTitle)}
                            >
                              {keyElem.webTitle}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pagination-wrapper">
              {currentPage > 1 ? (
                <button className="prev-bt" onClick={this.prev}>
                  Prev
                </button>
              ) : (
                ""
              )}
              {currentPage}
              {currentPage < totalPages ? (
                <button className="next-bt" onClick={this.next}>
                  Next
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
