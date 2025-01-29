class APIFetaures {
    constructor(query, querystring) {
      this.query = query;
      this.querystring = querystring;
    }
  
    filter() {
      //1A)filtering
      const queryObj = { ...this.querystring };
      const execludedQueries = ["page", "limit", "sort", "fields"];
      execludedQueries.forEach((el) => delete queryObj[el]);
      // console.log(queryObj,req.query);
      
      //1B)advanced filtering
      let queryStr = JSON.stringify(queryObj);
      // console.log(queryStr);
      queryStr = JSON.parse(
          queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`)
      );
  
      this.query = this.query.find(queryStr); //will not be executed untill we use await
      return this;
  }
  
      sort() {
          if (this.querystring.sort) {
              const sortBy = this.querystring.sort.split(",").join(" ");
              this.query = this.query.sort(sortBy);
          }
          return this;
  }
  
      limitFields() {
          if (this.querystring.fields) {
              const fields = this.querystring.fields.split(",").join(" ");
        
              this.query = this.query.select(fields);
            } else {
              this.query = this.query.select("-__v");
            }
              return this;
      }
  
      paginate() {
          const page = this.querystring.page * 1 || 1;
          const limit = this.querystring.limit * 1 || 9;
          const skip = (page - 1) * limit;
          // console.log(skip,page,limit);
        
          this.query = this.query.skip(skip).limit(limit);
          return this;
      }
  }
export default APIFetaures;