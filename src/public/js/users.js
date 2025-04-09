console.log("Users frontend javascript file");

$(
  $(".member-status").on("change", function (e) {
    const id = e.target.id;
    const status = e.target.value;

    axios
      .post(`/admin/user/update`, {
        _id: id,
        memberStatus: status,
      })
      .then((result) => {
        console.log(result);
        alert("Status updated successfully!");
        $(".member-status").blur();
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to update status!");
      });
  })
);