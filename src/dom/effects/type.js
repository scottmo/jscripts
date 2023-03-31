$.prototype.type = function(value) {
    return this.each(function() {
      this.val(value);
      this.trigger("input");
      this.trigger("change");
    });
};
